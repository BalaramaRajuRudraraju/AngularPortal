class SocialMediaModel {
    Code: string;
    Name: string;
}

class CompanySocialMediaInfoModel {
    CompanyId: number;
    SocialMediaLinks: SocialMediaModel[];
}

export {
    SocialMediaModel,
    CompanySocialMediaInfoModel
};
