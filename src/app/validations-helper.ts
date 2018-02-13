// All the regex expressions for validations goes here
const expressions = {
    REGEXP_MANDATORY: '^(.*)$',
    REGEXP_NUMERIC: '^[0-9]*$',
    REGEXP_NUMERIC_PLUS: '^[+0-9]*$',
    REGEXP_NOT_EMPTY: '^\\S+$',
    REGEXP_PRIVATE_BAG: '^[x][0-9]*$',
    REGEXP_COMPANY_REG_NUMBER: '^(\\d{4}\\/\\d{6}\\/\\d[06|07|23])$|^(\\d{12})$',
    REGEXP_COMPANY_VAT_NUMBER: '^4(\\d{9})$',
    REGEXP_PAYMENT_DAY: '^([0][1-9]|[12]\\d|3[01])$',
    REGEXP_ALPHA: '^[a-zA-Z]*$',
    REGEXP_ALPHA_NUMERIC: '^[a-zA-Z0-9]*$',
    REGEXP_ALPHA_NUMERIC_SPACE: '^[A-Za-z0-9 ]+$',
    REGEXP_ALPHA_NUMERIC_SPACE_AMPERSAND: '^[A-Za-z0-9& ]+$',
    REGEXP_ALPHA_NUMERIC_DOT: '^[A-Za-z0-9.]+$',
    REGEXP_ALPHA_HYPHEN: '^[a-zA-Z]+(-[a-zA-Z]+)?$',
    REGEXP_PHONE: '^(\\(0{1})([1-9]{2})\\)\\s(\\d{3})\\s(\\d{4})$',
    REGEXP_HBPHONE: '^(\+\d\d\s?[\(\s]\d\d[\)\s]\s?\d{3}[\s-]?\d{4})$',
    REGEXP_CELL_PHONE: '^(\\(0{1})([1-9]{2})\\)\\s(\\d{3})\\s(\\d{4})$',
    REGEXP_EMAIL: '^(?:[a-zA-Z0-9_-]+\\.?)+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,4}$',
    REGEXP_ADDRESS: '^[^?!@#$%^&*{}<>=+\\[\\]()|\\\/]*$',
    REGEXP_PASSPORT: '^[^?!@#$%^&*{}<>=+\\[\\]()|\\\/]*$',
    REGEXP_ALPHA_SPACE_HYPHEN: '^((?!\\s\\s|--|\'\'|\\d|[\\\\\\/.,~{}!@#$%^&*\(\)_=+|\\[\\]:,<>?]).)*$',
    REGEXP_FINANCIAL_YEAR_END: '^((0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[012]))$',
    REGEXP_PERCENTAGE_SHAREHOLDING: '^([\\d][\\d]?(\\.[\\d]?[\\d])?)%|(100%)$',
    REGEXP_CHAR_CHECK: '^[\\u0020-\\u007E\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF]*$',
    REGEXP_NOT_ZERO: '^[1-9][0-9]*$',
    REGEXP_DECIMAL_NOT_ZERO: '^[1-9]([0-9]+)?(\\.\\d{1,2})?$',
    REGEXP_GIIN_NUMBER: '^[a-zA-Z0-9]{16}$',
    REGEXP_DECIMAL_NUMERIC: '^[0-9]+(\\.[0-9]{1,2})?$',
    REGEXP_NUMERIC_PLUS_MINUS: '^[+0-9][0-9-]*$'
};

// All the user messages for validation failures goes here
const messages = {
};

export default {
    expressions,
    messages
};
