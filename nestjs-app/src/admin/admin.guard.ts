import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { timingSafeEqual, createHash } from "crypto";

const sha = (value: string) => createHash("sha256").update(value).digest();

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = GqlExecutionContext.create(context).getContext().req;
    const header: string = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const secret = process.env.ADMIN_TOKEN ?? "";

    if (!token || !secret) return false;
    
    return timingSafeEqual(sha(token), sha(secret));
  }
  
}
