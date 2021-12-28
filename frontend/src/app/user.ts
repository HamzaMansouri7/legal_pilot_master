export class user {
    constructor(
        public id?: number,
        public name?: string,
        public lastName?: string,
        public phone?: string,
        public email?: string,
        public picture?: string,
        public roomId?: Room[],
    ) { }
}

export class Room {
    constructor(
        public id?: number,
    ) { }
}

