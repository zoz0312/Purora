import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const [req] = ctx.getArgs();
    return req['user'];
  }
)