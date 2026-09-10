export type HomeMessagesType = { message: string };
export const HomeMessages = {
    categoryAdded: (actor: string) => ({ message: `Category added by ${actor}` }),
    categoryRemoved: (id: string, actor: string) => ({ message: `Category ${id} removed by ${actor}` }),
    slideAdded: (actor: string) => ({ message: `Slide added by ${actor}` }),
    slideRemoved: (id: string, actor: string) => ({ message: `Slide ${id} removed by ${actor}` }),
    slidesReordered: (actor: string) => ({ message: `Slides reordered by ${actor}` }),
    promoAdded: (actor: string) => ({ message: `Promo added by ${actor}` }),
    promoRemoved: (id: string, actor: string) => ({ message: `Promo ${id} removed by ${actor}` }),
    containerAdded: (id: string, actor: string) => ({ message: `Container ${id} added by ${actor}` }),
    containerUpdated: (id: string, actor: string) => ({ message: `Container ${id} updated by ${actor}` }),
    containerRemoved: (id: string, actor: string) => ({ message: `Container ${id} removed by ${actor}` }),
    containersReordered: (actor: string) => ({ message: `Containers reordered by ${actor}` }),
};