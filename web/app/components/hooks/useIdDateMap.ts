"use client";

import { ApiUser } from "@/app/types/user/Users";
import { useMemo, useState } from "react";

type MapType = {
    [key: string]: string[];
};

export function useIdDateMap(id?: string, date?: string) {
    function initial() {
        const map: MapType = {
            default: [],
        };

        if (id && id !== "0") {
            map[id] = [];
            if (date) {
                map.default.push(date);
            }
        }
        return map;
    }

    const [map, setMap] = useState<MapType>(initial);

    const returnObj = useMemo(() => {
        function switchUser(user: ApiUser) {
            const newMap = { ...map };
            const id = user.user_id;

            if (!newMap[id]) {
                newMap[id] = [];
            } else if (newMap[id].length === 0) {
                delete newMap[id];
            }
            setMap(newMap);
        }

        function setUsers(users: string[]) {
            const newMap = { ...map };

            users.forEach((id) => {
                if (!newMap[id]) {
                    newMap[id] = [];
                }
            });

            Object.keys(newMap).forEach((key) => {
                if (!users.includes(key) && key !== "default") {
                    delete newMap[key];
                }
            });

            setMap(newMap);
        }

        function switchUserDate(date: string, id: string = "default") {
            const newMap = { ...map };

            if (!newMap[id]) {
                newMap[id] = [];
            }

            if (newMap[id].includes(date)) {
                newMap[id] = newMap[id].filter((d) => d !== date);
                if (id !== "default" && newMap[id].length === 0) {
                    delete newMap[id];
                }
            } else {
                newMap[id].push(date);
            }
            setMap(newMap);
        }

        function setSingleDate(date: string) {
            const newMap = { ...map };
            newMap.default = [date];
            setMap(newMap);
        }

        function toSQL() {
            const obj: Record<string, string[]> = {};

            if (map.default.length === 0) {
                Object.keys(map).forEach((key) => {
                    if (key === "default") return;
                    obj[key] = map[key];
                });
            } else {
                Object.keys(map).forEach((key) => {
                    if (key === "default") return;
                    obj[key] = map.default;
                });
            }

            return obj;
        }

        const users = Object.keys(map).filter((key) => key !== "default");

        return {
            map,
            users,
            setMap,
            switchUser,
            setUsers,
            switchUserDate,
            setSingleDate,
            toSQL,
        };
    }, [map]);

    return returnObj;
}
