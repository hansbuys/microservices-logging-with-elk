# https://www.elastic.co/guide/en/logstash/current/docker.html
FROM docker.elastic.co/logstash/logstash:7.0.0

RUN rm -f /usr/share/logstash/pipeline/logstash.conf

COPY logstash.yml /usr/share/logstash/config/
COPY pipelines.conf /usr/share/logstash/pipeline/

USER root

RUN chown -R logstash:logstash /usr/share/logstash/config/logstash.yml
RUN chown -R logstash:logstash /usr/share/logstash/pipeline/pipelines.conf

USER logstash