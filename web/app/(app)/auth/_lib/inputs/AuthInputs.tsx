import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import styles from "./inputs.module.scss";
import DummyInput from "@/app/components/inputs/DummyInput";
import React from "react";

export function AuthEmailInput({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}) {
    return (
        <InputWrapper
            label="Электронная почта"
            isDisabled={false}
            required={false}
            id="email"
            className={styles.wrapper + " " + className}
        >
            <input
                type="email"
                value={value}
                onChange={onChange}
                required
                id="email"
                autoComplete="email"
                className={styles.input}
                inputMode="email"
                placeholder="Почта"
                maxLength={40}
            />
        </InputWrapper>
    );
}

export function AuthNameInput({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}) {
    return (
        <InputWrapper
            label="Ваше имя"
            isDisabled={false}
            required={false}
            id="first-name"
            className={styles.wrapper + " " + className}
        >
            <input
                type="text"
                value={value}
                onChange={onChange}
                required
                placeholder="Ваше имя"
                id="first-name"
                autoComplete="name"
                className={styles.input + " " + styles.first_name}
                maxLength={30}
            />
        </InputWrapper>
    );
}

export function AuthPasswordInput({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}) {
    return (
        <InputWrapper
            label="Пароль"
            isDisabled={false}
            required={false}
            id="password"
            className={styles.wrapper + " " + className}
            lengthOptions={{
                current: value.length,
                max: 100,
            }}
        >
            <input
                type="password"
                value={value}
                onChange={onChange}
                placeholder="Пароль"
                pattern="^[\x20-\x7E]{8,}$"
                required={true}
                id="password"
                autoComplete="password"
                className={styles.input + " " + styles.password}
                minLength={8}
            />
        </InputWrapper>
    );
}

export function AuthNewPasswordInput({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}) {
    return (
        <InputWrapper
            label="Пароль"
            isDisabled={false}
            required={false}
            id="password"
            className={styles.wrapper + " " + className}
            lengthOptions={{
                current: value.length,
                max: 100,
            }}
        >
            <input
                type="password"
                value={value}
                onChange={onChange}
                placeholder="Пароль"
                pattern="^[\x20-\x7E]{8,}$"
                required={true}
                id="password"
                autoComplete="new-password"
                className={styles.input + " " + styles.password}
                minLength={8}
            />
        </InputWrapper>
    );
}

export function AuthRepeatPasswordInput({
    value,
    onChange,
    password,
    className,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    password: string;
    className?: string;
}) {
    return (
        <InputWrapper
            label="Повторите пароль"
            isDisabled={false}
            required={false}
            id="password-repeat"
            className={styles.wrapper + " " + className}
            lengthOptions={{
                current: value.length,
                max: 100,
            }}
        >
            <input
                type="password"
                value={value}
                onChange={onChange}
                placeholder=""
                pattern="^[\x20-\x7E]{8,}$"
                required={true}
                id="password-repeat"
                autoComplete="new-password"
                className={styles.input + " " + styles.password}
                minLength={8}
            />
            <DummyInput value={password === value ? 1 : ""} />
        </InputWrapper>
    );
}

export function InviteCodeInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <InputWrapper
            label="Секретный код"
            isDisabled={false}
            required={false}
            className={styles.wrapper}
            id="invite-code"
        >
            <input
                type="text"
                value={value}
                onChange={onChange}
                required
                id="invite-code"
                autoComplete="off"
                className={styles.input}
                maxLength={5}
                minLength={5}
                placeholder="AB012"
            />
        </InputWrapper>
    );
}

export function EmailCodeInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <>
            <InputWrapper
                label="Код"
                isDisabled={false}
                id="code"
                lengthOptions={{
                    current: value.length,
                    max: 6,
                }}
            >
                <input
                    type="number"
                    value={value}
                    onChange={onChange}
                    placeholder="000 000"
                    required
                    id="code"
                    className={styles.code + " " + styles.input}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    minLength={6}
                />
            </InputWrapper>
            <DummyInput value={value.length === 6 ? 1 : ""} />
        </>
    );
}

export function AuthNote({ text }: { text: React.ReactNode }) {
    return <div className={styles.note}>{text}</div>;
}
