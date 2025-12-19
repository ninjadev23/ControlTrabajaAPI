import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/Users';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'https://controltrabajaapi-production.up.railway.app/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails?.[0].value;

        // 1. Limpieza robusta de la URL de la foto
        let googlePhoto = profile.photos?.[0]?.value || "";
        if (googlePhoto) {
          // Reemplazamos cualquier parámetro de tamaño por s400 para alta calidad
          googlePhoto = googlePhoto.replace(/=s\d+/, "=s400").replace(/\?sz=\d+/, "?sz=400");
        } else {
          googlePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        }

        // 2. Buscamos si el usuario ya existe para ver si tiene una foto local
        const existingUser = await UserModel.findOne({ googleId });

        // 3. Lógica de actualización inteligente
        const updateFields: any = {
          name,
          email,
          googleId
        };

        // SOLO actualizamos la foto si el usuario NO tiene una foto de "uploads" (local)
        // Esto evita que Google pise la foto que el usuario subió manualmente.
        if (!existingUser || !existingUser.profilePhoto || !existingUser.profilePhoto.includes('/uploads/')) {
          updateFields.profilePhoto = googlePhoto;
        }

        const user = await UserModel.findOneAndUpdate(
          { googleId },
          { 
            $set: updateFields,
            $setOnInsert: {
              nationality: "",
              birthdate: ""
            }
          },
          { 
            new: true, 
            upsert: true,
            setDefaultsOnInsert: false 
          }
        );

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);