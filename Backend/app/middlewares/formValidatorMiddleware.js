import { body } from "express-validator";

const formValidator = [
  body("fullName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Fullname name is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[0-9]/)
    .withMessage("Must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Must contain at least one uppercase letter")
    .matches(/[\W]/)
    .withMessage("Must contain at least one special character")
    .trim(),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  
];

export default formValidator;