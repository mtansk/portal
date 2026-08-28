import { paramArrayToString } from "@/app/functions/other";
import { SearchParams } from "next/dist/server/request/search-params";
import styles from "./welcome.module.scss";
import logo_image from "./../../../pub/images/logo-nobg.png";
import Image from "next/image";
import { Link } from "react-transition-progress/next";
import { Button } from "@/app/components/buttons/Buttons";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParamsRes = await searchParams;

    const learn = paramArrayToString(searchParamsRes.learn);

    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.logo}>
                    <Image
                        src={logo_image}
                        alt="logo"
                        className={styles.logo_image}
                        quality={100}
                        loading="eager"
                        priority={true}
                    />
                </div>
                <div className={styles.header}>Добро пожаловать!</div>
                <div className={styles.thank}>
                    {`Вы получили 1 месяц бесплатной подписки и у вас есть доступ
                    ко всем функциям Портала. `}
                </div>
                <div className={styles.steps}>
                    Пожалуйста, перед началом работы внимательно прочитайте про
                    <Link href={"/pub/docs#finance"}>
                        {` принципы управления зарплатой`}
                    </Link>
                    .
                </div>
                {learn === "1" ?
                    <div className={styles.learn}>
                        <div className={styles.learn_upper}>
                            {`При регистрации вы включили Режим ознакомления. В вашей компании сейчас есть тестовый
                                сотрудник, вы можете делать с ними все, что угодно. Удалить его
                                можно будет в разделе Мои компании в Профиле.`}
                        </div>
                    </div>
                :   ""}
                <div className={styles.app}>
                    Установите наше веб-приложение на ваше устройство. На
                    телефоне оно будет работать так же, как и обычное мобильное
                    приложение.
                </div>
                <div className={styles.button_div}>
                    <Button
                        type="filled"
                        colors="buy-pink-anim"
                        innerContent="Продолжить"
                        href="/company/subscription"
                    />
                </div>
            </div>
        </div>
    );
}

/* 
 <div className={styles.learn_upper}>
                            {`При регистрации вы включили Режим ознакомления. Если вы не хотите проходить коротенькое обучение,
                            пожалуйста, прочитайте только`}
                            <Link href={"/pub/docs#finance"}>
                                {` о зарплате`}
                            </Link>
                            .
                            <br />
                            Если хотите пройти обучение, пожалуйста, уделите 10
                            минут инструкции ниже, она поможет вам быстрее
                            освоиться и понять основные функции Портала.
                        </div>
                        <div className={styles.steps}>
                            <div className={styles.step}>
                                1. Внимательно прочитайте про
                                <Link href={"/pub/docs#finance"}>
                                    {` принципы управления зарплатой`}
                                </Link>
                                .
                            </div>
                            <div className={styles.step}>
                                2. В вашей компании сейчас есть тестовый
                                сотрудник. У него есть начисления (обычные и в
                                виде смен) и удержания. Посмотрите на них, а
                                потом вернитесь сюда.
                                <Link href={"/finance/accruals"}>
                                    {` Начисления`}
                                </Link>
                                .
                                <Link href={"/finance/reductions"}>
                                    {` Удержания`}
                                </Link>
                                .
                            </div>
                            <div className={styles.step}>
                                3. Представим, что во время работы мы создавали
                                сотруднику эти объекты, а теперь хотим выдать
                                ему зарплату. Для этого нам нужно создать
                                расчетный лист. На странице с
                                <Link href={"/finance/payslips"}>
                                    {` Расчетными листами `}
                                </Link>
                                {`нажмите кнопку "Создать лист", 
                                выберите тестового сотрудника и даты, например, 
                                начало: 5 дней назад; окончание: через неделю. Нажмите "Создать".`}
                            </div>
                            <div className={styles.step}>
                                4. Представим, что во время работы мы создавали
                                сотруднику эти объекты, а теперь хотим выдать
                                ему зарплату. Для этого нам нужно создать
                                расчетный лист. На странице с
                                <Link href={"/finance/payslips"}>
                                    {` Расчетными листами `}
                                </Link>
                                {`нажмите кнопку "Создать лист", 
                                выберите тестового сотрудника и даты, например, 
                                начало: 5 дней назад; окончание: через неделю. Нажмите "Создать".`}
                            </div>
                        </div>


*/
