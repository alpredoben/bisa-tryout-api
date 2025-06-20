import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { standartDateISO } from '../../utils/common.util';
import { TryoutStageModal } from '../models/TryoutStageModal';
import { UserModel } from '../models/UserModel';

const repository = AppDataSource.getRepository(TryoutStageModal);

const data = [
  { name: 'SKD', description: 'Seleksi Kompetensi Dasar' },
  { name: 'UTBK', description: 'Ujian Tulis Berbasis Komputer' },
  { name: 'Tes Online Tahap 1 ', description: 'TKD, AKHLAK, dan Wawasan Kebangsaan' },
  { name: 'Tes Online Tahap 2', description: 'Bahasa Inggris dan Learning Agility' },
];

export const TryoutStageSeeder = async () => {
  const repoUser = AppDataSource.getRepository(UserModel);
  let userId: any = null;
  const rowUser = await repoUser.findOne({
    where: {
      deleted_at: IsNull(),
      role: {
        role_slug: 'superadmin',
      },
    },
  });

  if (rowUser && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      const result = await repository.findOne({
        where: {
          name: element.name,
          deleted_at: IsNull(),
        },
      });

      if (!result) {
        await repository.save(
          repository.create({
            ...element,
            created_at: new Date(standartDateISO()),
            created_by: userId,
            updated_at: new Date(standartDateISO()),
            updated_by: userId,
          }),
        );
      }
    }
  }
};
