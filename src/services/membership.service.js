import { db } from "../db/index.js";
import { users } from "../db/schema/users.schema.js";
import { eq, or, desc, count } from "drizzle-orm";
import { createUserValidator } from "../validator/user.validator.js";
import { v7 as uuidv7 } from "uuid"; // Changed this line
import { bufferToUuid, uuidToBuffer } from "../utils/uuid.handler.js";