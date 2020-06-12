FROM node:lts-alpine
LABEL Description="Bookmark Service"

EXPOSE 3033
CMD ["yarn", "start"]
ENV THUMBOR_URL=http://localhost:8888
ENV THUMBOR_KEY=

ARG WORKDIR=/bookmarks
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

COPY . .

RUN mkdir -p public
RUN yarn install --production=true --frozen-lockfile --non-interactive
