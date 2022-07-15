import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import axios, { AxiosRequestConfig } from 'axios';
import { Request } from 'express';

const hspaRegistry = ['http://localhost:3004'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  helloWorld() {
    return 'hello world';
  }

  async handleSearch(req: Request) {
    try {
      hspaRegistry.forEach((hspaEndpoint) => {
        const config: AxiosRequestConfig = {
          method: 'post',
          baseURL: hspaEndpoint,
          url: '/search',
          headers: {
            'Content-Type': 'application/json',
          },
          data: req.body,
        };
        setTimeout(() => {
          try {
            this.sendResponse(config);
          } catch (error) {
            console.log(error);
          }
        }, 0);
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async sendResponse(hspaConfig: AxiosRequestConfig) {
    try {
      const resolvedResponse = await axios(hspaConfig);
      const config: AxiosRequestConfig = {
        method: 'post',
        baseURL: resolvedResponse.data.context.consumer_uri,
        url: 'on_search',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(resolvedResponse.data),
      };
      await axios(config);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('api/v1/search')
  broadcastSearch(@Req() req: Request) {
    setTimeout(() => {
      try {
        this.handleSearch(req);
      } catch (error) {
        console.log(error);
      }
    }, 0);
    return {
      error: {},
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };
  }
}
