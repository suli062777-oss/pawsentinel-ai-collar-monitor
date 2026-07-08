import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get()
  redirectToFrontend(@Req() request: Request, @Res() response: Response) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:4177';
    const apiBase = `${request.protocol}://${request.get('host')}`;
    const target = `${frontendUrl}/?page=world&api=${encodeURIComponent(apiBase)}`;

    return response.redirect(302, target);
  }
}
