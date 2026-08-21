export type ICommand<TResult = void> = {};
export interface ICommandHandler<TCommand extends ICommand<TResult>, TResult = void> {
    handle(command: TCommand): Promise<TResult>;
}
export interface ICommandBus {
    register(commandName: string, handler: ICommandHandler<any, any>): void;
    execute<TResult>(command: ICommand<TResult>): Promise<TResult>;
}
