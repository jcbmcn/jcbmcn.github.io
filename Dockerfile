FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8
ENV TZ=UTC

RUN apt-get update && apt-get install -y \
    ruby-full \
    build-essential \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up Ruby environment
ENV GEM_HOME=/usr/local/bundle
ENV PATH=${GEM_HOME}/bin:${PATH}
ENV BUNDLE_PATH=${GEM_HOME}
ENV BUNDLE_APP_CONFIG=${GEM_HOME}

# Install Jekyll and Bundler
RUN gem install jekyll bundler

WORKDIR /app

EXPOSE 4000