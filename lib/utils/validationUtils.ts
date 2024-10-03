/**
 * Проверяет, является ли переданная строка корректным email
 * @param {string} email - Строка для проверки
 * @returns {boolean} - Возвращает true, если строка является корректным email, иначе false
 */
export const isValidEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

/**
 * Проверяет, является ли строка непустой
 * @param {string} value - Строка для проверки
 * @returns {boolean} - Возвращает true, если строка непустая, иначе false
 */
export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
};

/**
 * Проверяет, соответствует ли строка заданной длине
 * @param {string} value - Строка для проверки
 * @param {number} minLength - Минимальная длина
 * @param {number} maxLength - Максимальная длина
 * @returns {boolean} - Возвращает true, если длина строки соответствует заданным параметрам, иначе false
 */
export const isLengthValid = (value: string, minLength: number, maxLength: number): boolean => {
    const length = value.length;
    return length >= minLength && length <= maxLength;
};

/**
 * Проверяет, является ли строка корректным URL
 * @param {string} url - Строка для проверки
 * @returns {boolean} - Возвращает true, если строка является корректным URL, иначе false
 */
export const isValidURL = (url: string): boolean => {
    const re = /^(http|https):\/\/[^ "]+$/;
    return re.test(url);
};

/**
 * Проверяет, ведет ли URL на указанный домен
 * @param {string} url - Строка для проверки
 * @param {string} domain - Ожидаемый домен
 * @returns {boolean} - Возвращает true, если URL ведет на указанный домен, иначе false
 */
export const isCorrectDomain = (url: string, domain: string): boolean => {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === domain;
};

/**
 * Проверяет URL для каждого из нужных сервисов
 * @param {string} urlGithub - URL GitHub
 * @param {string} urlBehance - URL Behance
 * @param {string} urlVk - URL VK
 * @returns {boolean} - Возвращает true, если все URL корректны и ведут на указанные сервисы, иначе false
 */
export const checkUrls = (urlGithub: string | undefined, urlBehance: string | undefined, urlVk: string | undefined): { [key: string]: boolean } => {
    const GITHUB_DOMAIN = "github.com";
    const BEHANCE_DOMAIN = "www.behance.net";
    const VK_DOMAIN = "vk.com";

    return {
        github: urlGithub ? isValidURL(urlGithub) && isCorrectDomain(urlGithub, GITHUB_DOMAIN) : true,
        behance: urlBehance ? isValidURL(urlBehance) && isCorrectDomain(urlBehance, BEHANCE_DOMAIN) : true,
        vk: urlVk ? isValidURL(urlVk) && isCorrectDomain(urlVk, VK_DOMAIN) : true
    };
};

/**
 * Проверяет, является ли переданное значение числом и находится ли оно в заданном диапазоне
 * @param {number | undefined} value - Число для проверки
 * @param {number} min - Минимальное значение
 * @param {number} max - Максимальное значение
 * @returns {boolean} - Возвращает true, если число в диапазоне, иначе false
 */
export const isInRange = (value: number | undefined, min: number, max: number): boolean => {
    if (value === undefined) return false;
    return value >= min && value <= max;
};

/**
 * Проверяет, соответствует ли изображение заданным размерам и имеет ли соотношение 16:9
 * @param {File} file - Файл изображения для проверки
 * @param {number} aspectRatioTolerance - Допустимое отклонение для соотношения сторон (в процентах)
 * @returns {Promise<Object>} - Возвращает объект с результатами проверки
 */
export const isValidImageSizeWithAspect = (
    file: File, 
    aspectRatioTolerance: number = 0.05 // допустимое отклонение 5%
): Promise<{
    isValidSize: boolean; 
    isAspectRatioValid: boolean; 
    errors: string[]; // Указываем тип для массива ошибок
}> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            const results = {
                isValidSize: true,
                isAspectRatioValid: true,
                errors: [] as string[],
            };

            // Проверка соотношения сторон
            const aspectRatio = 16 / 9;
            const actualAspectRatio = img.width / img.height;
            if (Math.abs((actualAspectRatio / aspectRatio) - 1) > aspectRatioTolerance) {
                results.isAspectRatioValid = false;
                results.errors.push('Соотношение сторон должно быть примерно 16:9');
            }

            resolve(results);
        };

        img.onerror = () => {
            resolve({
                isValidSize: false,
                isAspectRatioValid: false,
                errors: ['Ошибка загрузки изображения'],
            });
        };
    });
};


  

/**
 * Проверяет, соответствует ли размер файла заданным ограничениям
 * @param {File} file - Файл для проверки
 * @param {number} maxSizeMB - Максимальный допустимый размер файла в байтах
 * @returns {Promise<boolean>} - Возвращает true, если размер соответствует ограничениям, иначе false
 */
export const isValidFileSize = (file: File, maxSizeMB: number): Promise<boolean> => {
    return new Promise((resolve) => {
        const maxSizeB = maxSizeMB * 1024 * 1024 //Переводим в байты
        if (file && file.size < maxSizeB) {
            resolve(true);
        } else{
            resolve(false);
        }
    });
};