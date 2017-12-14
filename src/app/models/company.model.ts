import { CompanyAttribute } from './company-attribute.model';

export class Company {
    CompanyID: number;
    CompanyName: string;
    CompanyType: string;
    CompanyDefaultLanguage: string;
    CompanyEmail: string;
    CompanyRegistrationNumber: number;
    CompanyWebsite: string;
    CompanyCurrency: string;
    BusinessLandlineCode: string;
    BusinessLandlineNumber: string;
    BusinessMobileCode: string;
    BusinessMobileNumber: string;
    BusinessFaxCode: string;
    BusinessFaxNumber: string;
    BusinessLocation: string;
    CompanyAttributes: CompanyAttribute[];
}
