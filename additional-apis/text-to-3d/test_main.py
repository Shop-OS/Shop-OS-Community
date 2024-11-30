from gradio_client import Client

client = Client("https://c5070320b70a1b5efb.gradio.live/")


from gradio_client import Client

client = Client("https://c5070320b70a1b5efb.gradio.live/")
result_pre = client.predict(
		"https://bytedance-sdxl-lightning.hf.space/file=/tmp/gradio/3d7fbbaedfad502cf21cf73f77997c69c37f7e44/image.png",	# filepath  in 'Input Image' Image component
		True,	# bool  in 'Remove Background' Checkbox component
		0.5,	# float (numeric value between 0.5 and 1.0) in 'Foreground Ratio' Slider component
							api_name="/preprocess"
)

result = client.predict(
		result_pre,	# filepath  in 'Processed Image' Image component
		32,	# float (numeric value between 32 and 320) in 'Marching Cubes Resolution' Slider component
							api_name="/generate"
)

print(result)