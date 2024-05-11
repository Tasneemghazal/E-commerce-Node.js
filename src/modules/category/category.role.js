import { roles } from "../../utils/role.js";

export const endPoints = {
    create :[roles.Admin],
    get:[roles.Admin, roles.User],
    delete:[roles.Admin]
}