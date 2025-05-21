import AppDataSource from '../../../config/db.config';
import { UserModel } from '../../../database/models/UserModel';
import { I_AuthUserPayload, I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { MessageDialog } from '../../../lang';
import { comparedPassword, encryptPassword } from '../../../utils/bcrypt.util';
import { generatedToken } from '../../../utils/jwt.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { RoleService } from '../roles/service';

export class AuthService {
  private repository = AppDataSource.getRepository(UserModel);

  private roleService = new RoleService();

  async login(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ExpressResponse> {
    const { email, password } = payload;
    try {
      let row = await this.repository.findOne({
        where: {
          email,
        },
        relations: ['role'],
      });

      if (!row) {
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.auth.invalidEmail'),
          data: payload,
        };
      }

      const comparePwd = comparedPassword(payload.password, row.password);

      if (!comparePwd) {
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.auth.invalidPassword'),
          data: payload,
        };
      }

      await this.repository.save({
        ...row,
        ...payload,
      });

      // Create JWT Payload and Generate Token Access
      const jwtPayload: I_AuthUserPayload = {
        user_id: row.user_id,
        email: row.email,
        name: row.name,
        role: {
          role_id: row.role?.role_id,
          role_name: row.role?.role_name,
          role_slug: row.role?.role_slug,
        },
      };

      const access_token = generatedToken(jwtPayload);
      const refresh_token = generatedToken(jwtPayload, '7d');

      // Log Activity
      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.auth.login'),
        data: {
          access_token,
          refresh_token,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }

  async register(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ExpressResponse> {
    const { password_hash } = await encryptPassword(payload.password);
    payload.password = password_hash;
    try {
      const findMember = await this.roleService.findOneByCondition({ role_slug: 'member' });

      if (!findMember.success) {
        return findMember;
      }

      const result = await this.repository.save(
        this.repository.create({
          ...payload,
          registered_at: payload.created_at,
          role_id: findMember.data.role_id,
        }),
      );

      if (!result) {
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.auth.register'),
          data: result,
        };
      }

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.auth.register'),
        data: {
          user_id: result.user_id,
          email: result.email,
          name: result.name,
          role: result.role,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
