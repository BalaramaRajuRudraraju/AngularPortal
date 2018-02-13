import { Language } from './language.model';
import { Company } from './company.model';
import { CompanyAddress } from './company-address.model';
import { Package } from './package.model';
import { SellerSectors } from './seller-sectors.model';
import { SellerIndustries } from './seller-industries.model';
import { ProfileItems } from './profile-items.model';

export class Languages {
    Language: Language[];
}

export class LanguageListResponse {
    Languages: Languages;
}

export class CompanyInfoResponse {
    Company: Company;
}

export class CompanyAddressResponse {
    CompanyAddress: CompanyAddress[];
}

export class PackagesInfoResponse {
    Packages: Package;
}

export class SellerSectorListResponse {
    SellerSectors: SellerSectors;
}

export class SellerIndustriesListResponse {
    SellerIndustries: SellerIndustries[];
}

export class ProfileItemsResponse {
    ProfileItems: ProfileItems;
}
