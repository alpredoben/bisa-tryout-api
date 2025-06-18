import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { standartDateISO } from '../../utils/common.util';
import { TryoutCategoryModel } from '../models/TryoutCategoryModal';
import { UserModel } from '../models/UserModel';

const repository = AppDataSource.getRepository(TryoutCategoryModel);

const data = [
  { name: 'Tryout BUMN Career', description: 'Tryout Seleksi Kenaikan Karir Pegawai BUMN ' },
  { name: 'Tryout Recruitment BUMN', description: 'Tryout Seleksi Penerimaan Pegawai BUMN' },
  { name: 'Tryout CASN', description: 'Tryout Seleksi Calon Aparatur Sipil Negara ' },
  { name: 'Tryout SKD', description: 'Tryout Seleksi Ujian Sekolah Kedinasan' },
  { name: 'Tryout SNBT', description: 'Tryout Seleksi Nasional Berdasarkan Tes' },
];

export const TryoutCategorySeeder = async () => {
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
