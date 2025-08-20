// src/reports/reports.controller.ts
import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, ParseIntPipe, Query} from '@nestjs/common';
import { ReportsService, CreateReportDto } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ReportStatus } from '../entities/report.entity';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(@Request() req, @Body() createReportDto: CreateReportDto) {
    const report = await this.reportsService.create(req.user.id, createReportDto);
    return {
      success: true,
      message: 'Laporan berhasil dikirim',
      data: report,
    };
  }

  // Admin only endpoints
  @UseGuards(AdminGuard)
  @Get()
  async findAll(@Query('status') status?: ReportStatus) {
    const reports = await this.reportsService.findAll(status);
    return {
      success: true,
      data: reports,
    };
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const report = await this.reportsService.findOne(id);
    return {
      success: true,
      data: report,
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: ReportStatus,
    @Body('adminNote') adminNote?: string,
  ) {
    const report = await this.reportsService.updateStatus(id, status, adminNote);
    return {
      success: true,
      message: 'Status laporan berhasil diupdate',
      data: report,
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/resolve')
  async resolveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body('adminNote') adminNote?: string,
  ) {
    await this.reportsService.resolveReport(id, adminNote);
    return {
      success: true,
      message: 'Laporan berhasil diselesaikan',
    };
  }
}