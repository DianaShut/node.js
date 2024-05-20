import { randomUUID } from "node:crypto"; // вбудований модуль для генерації унікальних ідентифікаторів, які використовуються для іменування файлів
import path from "node:path";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";

import { config } from "../configs/config";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";

class S3Service {
  constructor(
    private readonly client = new S3Client({
      region: config.AWS_S3_REGION,
      credentials: {
        accessKeyId: config.AWS_S3_ACCESS_KEY,
        secretAccessKey: config.AWS_S3_SECRET_KEY,
      },
    }),
  ) {} //Конструктор створює клієнт S3, використовуючи параметри регіону та облікових даних з конфігурації. client ініціалізується в конструкторі як приватна властивість класу.

  public async uploadFile(
    //Приймає файл, тип елементу та ідентифікатор елементу
    file: UploadedFile,
    itemType: FileItemTypeEnum,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = this.buildPath(itemType, itemId, file.name); //Генерує шлях до файлу за допомогою методу buildPath
      await this.client.send(
        new PutObjectCommand({
          //Використовує команду PutObjectCommand для завантаження файлу до S3 бакету
          Bucket: config.AWS_S3_BUCKET_NAME,
          Key: filePath,
          Body: file.data,
          ContentType: file.mimetype,
          ACL: "public-read", //Дозволяє доступ до файлу для публічного читання
        }),
      );
      return filePath; //Повертає шлях до файлу
    } catch (error) {
      console.error("Error upload: ", error);
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: config.AWS_S3_BUCKET_NAME,
          Key: filePath,
        }),
      );
    } catch (error) {
      console.error("Error deleting: ", error);
    }
  }

  private buildPath(
    itemType: FileItemTypeEnum,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`; // use only  template string
  }
}

export const s3Service = new S3Service();
