FROM golang:1.19-alpine as server
WORKDIR /app
COPY ./server . 
RUN go mod vendor
RUN go build -mod=vendor -ldflags "-w" -o shrug .

FROM node:15.0.1 as client
RUN mkdir -p /client
WORKDIR /client
COPY ./client ./
COPY ./.env ./..
RUN yarn install
RUN yarn build:prod

FROM alpine
RUN addgroup -S shrug && adduser -S shrug -G shrug
USER shrug

WORKDIR /client/public
COPY --from=client /client/public .

WORKDIR /app
COPY --from=server /app/shrug .

CMD ["./shrug"]
