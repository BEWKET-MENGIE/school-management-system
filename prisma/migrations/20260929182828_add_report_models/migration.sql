-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('STUDENT_REPORT_CARD', 'CLASS_MASTER_SHEET', 'FEE_SUMMARY');

-- CreateTable
CREATE TABLE "ReportDownloadLog" (
    "id" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "studentId" TEXT,
    "termId" TEXT,
    "reportType" "ReportType" NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportDownloadLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedReportCard" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedReportCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedReportCard_studentId_termId_key" ON "SavedReportCard"("studentId", "termId");

-- AddForeignKey
ALTER TABLE "ReportDownloadLog" ADD CONSTRAINT "ReportDownloadLog_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDownloadLog" ADD CONSTRAINT "ReportDownloadLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDownloadLog" ADD CONSTRAINT "ReportDownloadLog_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReportCard" ADD CONSTRAINT "SavedReportCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReportCard" ADD CONSTRAINT "SavedReportCard_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;
