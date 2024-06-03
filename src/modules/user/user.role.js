import { roles } from "../../utils/role.js";

export const endPoints = {
    getUsers:[roles.Admin],
    getUserData:[roles.Admin,roles.User],
}