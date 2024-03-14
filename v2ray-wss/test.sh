  read -t 15 -p "回车或等待15秒为默认wss名称，或者自定义名称请输入："  getWssname
  if [ -z $getWssname ];then
      getWssname="1024-wss"
  fi
  echo $getWssname