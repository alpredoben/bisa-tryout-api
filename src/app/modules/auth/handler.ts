import { Response } from 'express';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { standartDateISO } from '../../../utils/common.util';
import { getRequestProperties } from '../../../utils/request.util';
import { sendResponseJson } from '../../../utils/response.util';
import { UserService } from '../users/service';
import { AuthService } from './service';

class AuthHandler {
  private readonly service = new AuthService();
  private readonly userService = new UserService();

  bodyValidation(req: I_RequestCustom): Record<string, any> {
    let payload: Record<string, any> = {};

    if (req?.body?.name) {
      payload.name = req?.body?.name;
    }

    if (req?.body?.email) {
      payload.email = req?.body?.email;
    }

    if (req?.body?.password) {
      payload.password = req?.body?.password;
    }

    if (req?.body?.phone) {
      payload.phone = req?.body?.phone;
    }

    if (req?.body?.role_id) {
      payload.role_id = req?.body?.role_id;
    }

    if (req?.body?.file_id) {
      payload.file_id = req?.body?.file_id;
    }

    if (req?.body?.otp_code) {
      payload.otp_code = req?.body?.otp_code;
    }

    if (req?.body?.confirm_password) {
      payload.confirm_password = req?.body?.confirm_password;
    }

    return payload;
  }

  async login(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO());
    const reqProp = getRequestProperties(req);

    let payload: Record<string, any> = {
      last_login: today,
      last_ip: reqProp.request_ip,
      last_hostname: reqProp.request_host,
      ...this.bodyValidation(req),
    };

    const result = await this.service.login(req, payload);

    if (result?.success) {
      if (payload?.remember_me == true) {
        res.cookie('refresh_token', result?.data?.refresh_token, { httpOnly: true });
      }
    }

    return sendResponseJson(res, result);
  }

  async register(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO());

    let payload: Record<string, any> = {
      created_at: today,
      ...this.bodyValidation(req),
    };

    const result = await this.service.register(req, payload);
    return sendResponseJson(res, result);
  }

  async fetchProfile(req: I_RequestCustom, res: Response): Promise<Response> {
    const id: any = req?.user?.user_id;
    const result = await this.userService.findById(id);
    return sendResponseJson(res, result);
  }
}

export default new AuthHandler();
