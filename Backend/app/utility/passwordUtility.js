import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log("Erro while hashing password : ", error.message);
    throw new Error("Error hashing password : " + error.message);
  }
};

export const passComparison = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log("Error while comparing passwords : ", error.message);
    throw new Error("Error comparing passwords: " + error.message);
  }
};
