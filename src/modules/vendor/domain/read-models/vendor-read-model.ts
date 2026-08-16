export type VendorReadModel = {
    id: string;
    ownerId: string;
    title: string;
    slug: string;
    description: string;

    images: {
        logo: string;
        banner: string;
    };

    contact: {
        phone: string;
        email: string;
        address: {
            streetAddress: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        };
    };
    // stats: {
    //     totalSales: number;
    //     totalOrders: number;
    //     completedOrders: number;
    //     cancelledOrders: number;
    //     returnedOrders: number;
    //     refundedOrders: number;
    //     totalProducts: number;
    //     rating: number;
    //     totalReviews: number;
    // };
    verification: {
        isVerified: boolean;
        verifiedAt: Date | null;
        rejectedReason: string | null;
    };
    isDeleted: boolean;
};
