FROM gcc:4.9
MAINTAINER na-g@nostrum.com
 
CMD apt-get update
CMD DEBIAN_FRONTEND=noninteractive apt-get -y upgrade

CMD curl -sL https://deb.nodesource.com/setup_6.x | bash -
#Install build tools
CMD DEBIAN_FRONTEND=noninteractive apt-get -y install \
  --no-install-recommends \
  autoconf2.13 \
  build-essential \
  distcc \
  ccache \
  wget \
  mercurial \
  python \
  python-dev \
  python-pip \
  ca-certificates \
  zip \
  unzip \
  pkg-config \
  yasm \
  git \
  nodejs \
  build-essential

# Install build dependencies
CMD DEBIAN_FRONTEND=noninteractive apt-get -y install \
  --no-install-recommends \
  libgtk-3-dev \
  libgtk2.0-dev \
  libgconf2-dev \
  libdbus-glib-1-dev \
  libasound2-dev \
  libpulse-dev \
  libgstreamer0.10-dev \
  libgstreamer-plugins-base0.10-dev \
  libxt-dev

#Update mercurial
CMD pip install --upgrade Mercurial


WORKDIR /home/build
#Exporting the build home volume
VOLUME /home/build
#Allow mach to build without setting up mercurial
ENV I_PREFER_A_SUBOPTIMAL_MERCURIAL_EXPERIENCE=true

#Export a shell so that mach can identify the system as Linux
ENV SHELL=/bin/bash

LABEL na-g.mozilla-central-build.version="0.1"

CMD git config --global user.name jbhoosreddy
CMD git config --global user.email jaideepb@buffalo.edu

# CMD git clone https://github.com/jbhoosreddy/moz-devtools-gitbot.git

COPY . .

# CMD cd moz-devtools-gitbot && \
node index.js

# CMD cd moz-devtools-gitbot && \
#  npm install && \
#  node index.js
#  pwd && \
#  git clone https://github.com/jbhoosreddy/debugger.html.git && \
#  hg clone https://hg.mozilla.org/mozilla-central
