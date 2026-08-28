import { AccessLevels } from "../types/access/Access";
import { ApiUser } from "../types/user/Users";

export function accessLevelString(accessLevel: AccessLevels | null): string {
    switch (accessLevel) {
        case "admin":
            return "Администратор";
        case "manager":
            return "Менеджер";
        case "employee":
            return "Сотрудник";
        default:
            return "Неизвестно";
    }
}
export function accountStatusString(user: ApiUser): string {
    if (user.account_status === "active") return "Активен";
    if (user.account_status === "suspended") return "Отключен";
    if (user.invite_id) return "Ожидает регистрации";
    return "Не создан";
}
