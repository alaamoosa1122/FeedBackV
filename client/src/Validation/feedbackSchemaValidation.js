import * as yup from "yup";

export const getFeedbackSchemaValidation = (lang = "en") => {
  const isArabic = lang === "ar";

  return yup.object().shape({
    name: yup
      .string()
      .required(isArabic ? "الاسم مطلوب" : "Name is required")
      .min(2, isArabic ? "الاسم يجب أن يكون على الأقل حرفين" : "Name must be at least 2 characters long"),

    number: yup
      .string()
      .required(isArabic ? "رقم الهاتف مطلوب" : "Phone number is required")
      .matches(
        /^\d{8}$/,
        isArabic
          ? "رقم الهاتف غير صحيح (يجب أن يكون 8 أرقام ويبدأ بـ 9)"
          : "Phone number must be exactly 8 digits and start with 9"
      ),

    event: yup
      .string()
      .required(isArabic ? "اسم الفعالية مطلوب" : "Event name is required")
      .min(3, isArabic ? "اسم الفعالية يجب أن يكون 3 أحرف على الأقل" : "Event name must be at least 3 characters long"),

    rating: yup
      .number()
      .typeError(isArabic ? "الرجاء اختيار تقييم من 1 إلى 5" : "Please select a rating from 1 to 5")
      .required(isArabic ? "التقييم مطلوب" : "Rating is required")
      .min(1, isArabic ? "التقييم يجب أن يكون بين 1 و 5" : "Rating must be between 1 and 5")
      .max(5, isArabic ? "التقييم يجب أن يكون بين 1 و 5" : "Rating must be between 1 and 5"),

    comments: yup
      .string()
      .required(isArabic ? "التعليق مطلوب" : "Comments are required")
      .min(5, isArabic ? "يرجى كتابة تعليق مفيد على الأقل 5 أحرف" : "Please enter a comment of at least 5 characters"),
  });
};
