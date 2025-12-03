import {
  EEnrollmentStatus,
  ILemonSqueezyOrderWebhook,
} from "@packages/definitions";
import { Logger } from "@packages/logger";
import crypto from "crypto";
import { CourseEnrollment } from "../../entity/course/courseEnrollment";
import { CourseEnrollmentRepository } from "../../repository";
import { BaseService } from "../common/base";
import { courseService } from "./course";

export class CourseEnrollmentService extends BaseService<CourseEnrollment> {
  constructor() {
    super(CourseEnrollmentRepository);
  }

  async enrollNewCourse(orderData: ILemonSqueezyOrderWebhook) {
    const userId = +orderData?.meta?.custom_data?.userId;
    const courseId = +orderData?.meta?.custom_data?.courseId;

    if (!userId || !courseId) {
      Logger.error("No custom data found in order data");
      throw new Error("Invalid order data.");
    }

    // Check if user is already enrolled in this course
    const existingEnrollment = await this.repository.findOne({
      where: {
        userId,
        courseId,
        status: EEnrollmentStatus.ACTIVE,
      },
    });

    if (existingEnrollment) {
      Logger.warning(
        `User ${userId} is already enrolled in course ${courseId}`
      );
      throw new Error("User is already enrolled in this course.");
    }

    const course = await courseService.getCourseById(courseId);
    const expiresAt = course.validityYear
      ? new Date(
          new Date().setFullYear(new Date().getFullYear() + course.validityYear)
        )
      : null;

    if (!expiresAt) {
      Logger.error("No expiration date found in course data");
      throw new Error("No expiration date found in course data");
    }

    return this.create({
      userId,
      courseId,
      status: EEnrollmentStatus.ACTIVE,
      expiresAt: expiresAt,
      invoiceLink: orderData?.data?.attributes?.urls?.receipt || "",
      lemonSqueezyOrderId:
        orderData?.data?.attributes?.first_order_item?.order_id,
      lemonSqueezyCustomerId: orderData?.data?.attributes?.customer_id,
      totalPrice: orderData?.data?.attributes?.total / 100,
      paidUserName: orderData?.data?.attributes?.user_name,
      paidUserEmail: orderData?.data?.attributes?.user_email,
    });
  }

  async getUserEnrolledCourses(userId?: number) {
    const where = userId
      ? { userId, status: EEnrollmentStatus.ACTIVE }
      : { status: EEnrollmentStatus.ACTIVE };

    return await this.repository.find({
      where,
      relations: ["course", "user"],
      select: [
        "course",
        "courseId",
        "expiresAt",
        "createdAt",
        "invoiceLink",
        "totalPrice",
        "status",
        "user",
      ],
    });
  }

  async verifySignature(rawBody: string, signature: string) {
    const secret = process.env.LS_WEBHOOK_SECRET;

    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const sig = Buffer.from(signature || "", "utf8");

    if (!crypto.timingSafeEqual(digest, sig)) {
      Logger.debug("Lemon squeezy signature mismatch on webhook verification");
      throw new Error("Invalid webhook signature.");
    }

    Logger.info("Lemon squeezy signature verified successfully");
    return true;
  }
}

export const courseEnrollmentService = new CourseEnrollmentService();
