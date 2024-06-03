import { roles } from "../../utils/role.js";

export const endPoints = {
    create :[roles.User],
    getOrders :[roles.User],
    all:[roles.Admin],
    delete:[roles.Admin],
    changeStatus:[roles.Admin]
}