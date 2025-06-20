import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { standartDateISO } from '../../utils/common.util';
import { OrganizationModal } from '../models/OrganizationModal';
import { TryoutCategoryModal } from '../models/TryoutCategoryModal';
import { UserModel } from '../models/UserModel';

const repository = AppDataSource.getRepository(TryoutCategoryModal);
const repoOrganization = AppDataSource.getRepository(OrganizationModal);

const data = [
  {
    name: 'BUMN Career 2025',
    description: 'Tryout Seleksi Kenaikan Karir Pegawai BUMN Tahun 2025',
    year: 2025,
    price: 5000,
    organization: 'BUMN',
  },
  {
    name: 'BUMN Career 2024',
    description: 'Tryout Seleksi Kenaikan Karir Pegawai BUMN Tahun 2024',
    year: 2024,
    price: 4000,
    organization: 'BUMN',
  },

  {
    name: 'Recruitment BUMN 2025',
    description: 'Tryout Seleksi Penerimaan Pegawai BUMN 2025',
    year: 2025,
    price: 4000,
    organization: 'BUMN',
  },
  {
    name: 'Recruitment BUMN 2025',
    description: 'Tryout Seleksi Penerimaan Pegawai BUMN 2024',
    year: 2024,
    price: 3000,
    organization: 'BUMN',
  },

  {
    name: 'CASN 2024',
    description: 'Tryout Seleksi Calon Aparatur Sipil Negara 2024',
    year: 2024,
    price: 3000,
    organization: 'ASN',
  },
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
      const { organization, ...element } = data[i];

      const findOrganization = await repoOrganization.findOne({
        where: {
          deleted_at: IsNull(),
          name: organization,
        },
      });

      if (findOrganization) {
        const result = await repository.findOne({
          where: {
            name: element.name,
            organization: {
              organization_id: findOrganization.organization_id,
            },
            deleted_at: IsNull(),
          },
          relations: {
            organization: true,
          },
        });

        if (!result) {
          await repository.save(
            repository.create({
              ...element,
              organization_id: findOrganization.organization_id,
              created_at: new Date(standartDateISO()),
              created_by: userId,
              updated_at: new Date(standartDateISO()),
              updated_by: userId,
            }),
          );
        }
      }
    }
  }
};
