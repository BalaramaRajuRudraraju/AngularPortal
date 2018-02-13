import { LanguageOperationType } from './language-operation-types.model';

class Language {
    LanguageID: number;
    LanguageName: string;
    LanguageOperationTypes: LanguageOperationType[];
}

class Languages {
    Language: Language[];
}

class GetLanguagesResponse {
    Languages: Languages;
}

export {
    GetLanguagesResponse,
    Languages,
    Language
};

