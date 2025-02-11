import mongoose from "mongoose";

export const sessionWithTransaction = (fn) => async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await fn(req, res, next, session);
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};
