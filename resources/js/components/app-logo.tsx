import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md">
                <AppLogoIcon className="size-10 fill-current text-white dark:text-black" />
            </div>

            {/* Text block */}
            <div className="mt-1 grid flex-1 text-left">
                <span className="truncate leading-tight font-semibold text-sm">
                    SOLEPGEA
                </span>

                {/* Provincial label below */}
                <small className="text-[11px] text-gray-500 leading-tight">
                    PGSL Employees Association
                </small>
            </div>
        </>
    );
}
