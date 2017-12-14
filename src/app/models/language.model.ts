import { LanguageOperationType } from './language-operation-types.model';

export class Language {
    LanguageID: number;
    LanguageName: string;
    LanguageOperationTypes: LanguageOperationType[];
}
