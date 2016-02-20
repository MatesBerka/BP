#!/bin/bash
BASE_DIR=".."

PYTHON_BIN="python"
JVM_ARCH="-d64"

CLOSURE_BUILD_DIR="${BASE_DIR}/www/js-closure/closure/bin/build"
CLOSURE_UTIL_DIR="${BASE_DIR}/bin/closure"

JS_APP_DIR="${BASE_DIR}/www/js"
JS_APP_INPUT="${BASE_DIR}/www/js/app.js"

JS_APP_COMPILLED="${BASE_DIR}/www/js/app-compiled.js"
JS_APP_DEPS="${BASE_DIR}/www/js/app-deps.js"
JS_APP_MESSAGES="${BASE_DIR}/www/js-messages/messages.xtb"

JS_CLOSURE_LIB_DIR="${BASE_DIR}/www/js-closure/closure/goog"
JS_CLOSURE_THIRD_PARTY_DIR="${BASE_DIR}/www/js-closure/third_party/closure/goog"
JS_CLOSURE_SOY_DIR="${BASE_DIR}/www/js-soy"

TEMPLATE_DIR="${BASE_DIR}/www/js"

URL_APP="${BASE_DIR}/www/js"
URL_SOY="${BASE_DIR}/www/js/js-soy"

LANG="cs"
LOCALE="cs_CZ"

compile() {
	${PYTHON_BIN} ${CLOSURE_BUILD_DIR}/closurebuilder.py \
		--root=${JS_APP_DIR} \
		--root=${JS_CLOSURE_LIB_DIR} \
		--root=${JS_CLOSURE_THIRD_PARTY_DIR} \
		--root=${JS_CLOSURE_SOY_DIR} \
		--input=${JS_APP_INPUT} \
		--output_mode=compiled \
		--compiler_jar=${CLOSURE_UTIL_DIR}/compiler.jar \
		--jvm_flags="${JVM_ARCH}" \
		--compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
		--compiler_flags="--generate_exports" \
		--compiler_flags="--warning_level=verbose" \
		--compiler_flags="--define=goog.DEBUG=false" \
		--compiler_flags="--define=goog.LOCALE='${LOCALE}'" \
		--output_file=${JS_APP_COMPILLED}
}

deps() {
	${PYTHON_BIN} ${CLOSURE_BUILD_DIR}/depswriter.py \
		--root_with_prefix="${JS_APP_DIR} ${URL_APP}" \
		--root_with_prefix="${JS_CLOSURE_SOY_DIR} ${URL_SOY}" \
		--output_file=${JS_APP_DEPS}
}

messages() {
	${PYTHON_BIN} ${CLOSURE_BUILD_DIR}/closurebuilder.py \
		--root=${JS_APP_DIR} \
		--root=${JS_CLOSURE_LIB_DIR} \
		--root=${JS_CLOSURE_THIRD_PARTY_DIR} \
		--root=${JS_CLOSURE_SOY_DIR} \
		--input=${JS_APP_INPUT} \
		--output_mode=compiled \
		--compiler_jar=${CLOSURE_UTIL_DIR}/XtbGenerator.jar \
		--jvm_flags="${JVM_ARCH}" \
		--compiler_flags="--translations_file=${JS_APP_MESSAGES}" \
		--compiler_flags="--xtb_output_file=${JS_APP_MESSAGES}" \
		--compiler_flags="--lang=${LANG}"
}

soy() {
	java -jar ${CLOSURE_UTIL_DIR}/SoyToJsSrcCompiler.jar \
		--outputPathFormat {INPUT_DIRECTORY}/{INPUT_FILE_NAME}.js \
		--shouldGenerateJsdoc \
		--shouldProvideRequireSoyNamespaces \
		--shouldGenerateGoogMsgDefs \
		--bidiGlobalDir 1 \
		--srcs $(find ${TEMPLATE_DIR} -iname '*.soy' -type f -print0 | xargs -0 echo)
}

info() {
	echo ""
	echo "=== ${1}"
}

case $1 in
	build)
		info "Compiling SOY"
		soy

		info "Generating messages"
		messages

		info "Compiling JS"
		compile
		;;

	compile)
		compile
		;;

	deps)
		deps
		;;

	messages)
		messages
		;;

	soy)
		soy
		;;

	*)
		echo "Usage: $0 [build|compile|deps|messages|soy]"
		exit 1
esac
