import { Company } from './company.model';
import { CompanyAddress } from './company-address.model';
import { CompanySocialMediaInfoModel, SocialMediaModel } from './company-social-media-info.model';
import { ProfileProgressModel } from './profile-progress.model';

export class SellerInformation {
    companyInfo: Company;
    companyAddresses: CompanyAddress[];
    selectedIndustriesList;
    SocialMediaInfo: SocialMediaModel[];
    profileProgress: ProfileProgressModel;
    profileProgressPercentage: number;
    companyDocs: string[];
}
