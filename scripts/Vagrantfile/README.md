# Vagrantfile

Enclosed is a simple Vagrantfile that creates two boxes, `stock` and `testing`,
both based off of `folio/testing`. The redundancy here is needed so that the
`testing` box can be used for normal development then, once you are ready to
test against normal Okapi and other modules, you can try changes on `stock` and
reset the machine as needed.

Since this has multiple boxes, each command you use will need to specify the
box. For example:

`vagrant up` becomes `vagrant up testing`

`vagrant ssh` becomes `vagrant ssh stock`

`vagrant destroy --force` becomes `vagrant destroy --force stock`
