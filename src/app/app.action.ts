export class SetUsername {
    static readonly type = '[USERNAME] Set';
    constructor(public payload: string) {}
}
