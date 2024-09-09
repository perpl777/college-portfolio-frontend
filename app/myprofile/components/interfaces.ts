export interface DataStudent {
    title: string;
    description: string;
    tags: string;
    worktype: string
    background: boolean
    url_file?: string;
    url_view: any;
}

export interface OldDataPost {
    id: number;
    attributes: {
        title: string;
        description: string;
        tags: {
            data: Tags[];
        }
        worktype: {
            data: {
                id: number;
                attributes: {
                    name: string
                }
            }
        }
        background: boolean
        url_file?: string;
        url_view: any;
        published: boolean
    }
}

interface Tags {
    id: number;
    attributes: {
        name: string;
    };
}

export interface UserRoleProps {
    role: {
        name: string
    }
}

export interface User {
    email: string;
    name: string;
}