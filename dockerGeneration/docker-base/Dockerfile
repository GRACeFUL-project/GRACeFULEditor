FROM ubuntu
RUN apt-get update && apt-get install -y \
  git \
  nano \ 
  curl \ 
  cmake \
  subversion \
  flex \
  libbison-dev \
  wget 
  
#INSTALL REQUIRED COMPONENTS FOR MZN   
RUN mkdir mznSrc && \
  cd mznSrc &&\
  wget https://github.com/MiniZinc/MiniZincIDE/releases/download/2.1.0/MiniZincIDE-2.1.0-bundle-linux-x86_64.tgz && \
  tar zxf MiniZincIDE-2.1.0-bundle-linux-x86_64.tgz && \
  rm MiniZincIDE-2.1.0-bundle-linux-x86_64.tgz  && \
  cd / && \ 
  mkdir mznBin &&\
  cd mznSrc/MiniZincIDE-2.1.0-bundle-linux-x86_64 && \
  cp solns2out mzn2fzn fzn-gecode mzn-gecode minizinc /mznBin && \
  export MZN_STDLIB_DIR=/mznSrc/MiniZincIDE-2.1.0-bundle-linux-x86_64/share/minizinc


  
#INSTALL STACK
RUN wget -qO- https://get.haskellstack.org/ | sh && \
  stack setup
  
  
# download repos 
RUN cd / &&\
  mkdir gitGrace && \
  cd gitGrace && \
  git clone https://github.com/GRACeFUL-project/GRACe.git ./ && \
  stack build && \
  cd .. && \
  mkdir gitEditor && \
  cd gitEditor && \
  git clone https://github.com/GRACeFUL-project/GRACeFULEditor.git ./


# add mznPath 
RUN apt-get install -y qtdeclarative5-dev qml-module-qtquick-controls &&\
  export PATH="/mznBin:/:$PATH"

RUN cd /gitGrace && \  
  stack build
