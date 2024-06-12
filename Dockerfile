FROM debian:trixie-slim

LABEL org.opencontainers.image.source=https://github.com/Toomas633/XMRig-Proxy
LABEL org.opencontainers.image.description="XMRig Proxy with web server for statistics"
LABEL org.opencontainers.image.licenses=GPL-3.0
LABEL org.opencontainers.image.authors=Toomas633

ENV DEBIAN_FRONTEND=noninteractive

ENV POOL_URL=""
ENV USER=""
ENV PASS="x"
ENV ALGO="rx/0"

RUN apt-get update && \
    apt-get install -y --no-install-recommends\
    apache2 \
    php8.2 \
    libapache2-mod-php \
    ca-certificates \
    git \
    build-essential \
    cmake \
    libuv1-dev \
    libssl-dev \
    libhwloc-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

RUN git clone https://github.com/xmrig/xmrig-proxy.git /xmrig-proxy && \
    cd /xmrig-proxy && \
    mkdir build && cd build && \
    cmake .. && \
    make && \
    cd / && rm -rf /xmrig-proxy/.git

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

EXPOSE 3333 80 8080

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY web /var/www/html

COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

ENTRYPOINT ["/entrypoint.sh"]
