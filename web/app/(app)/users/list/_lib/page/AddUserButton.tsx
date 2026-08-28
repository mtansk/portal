"use client";

import useBackURL from "@/app/components/hooks/useBackURL";
import { Button } from "@/app/components/buttons/Buttons";

export default function AddUserButton() {
    const backurl = useBackURL();

    return (
        <Button
            type="filled"
            colors="nav-blue"
            innerContent="Добавить сотрудника"
            href={`/users/add?backurl=${backurl}`}
        />
    );
}
